import math
import random

class PaillierCrypto:
    def __init__(self, key_size=1024):
        """
        Initialize Paillier Cryptosystem
        
        Args:
            key_size (int): Bit size for prime number generation
        """
        # Generate two large prime numbers p and q
        self.p = self.generate_large_prime(key_size // 2)
        self.q = self.generate_large_prime(key_size // 2)
        
        # Compute n = p * q
        self.n = self.p * self.q
        self.n_square = self.n ** 2
        
        # Compute lambda(n) = lcm(p-1, q-1)
        self.lambda_n = math.lcm(self.p - 1, self.q - 1)
        
        # Choose generator g
        self.g = self.n + 1
        
        # Compute modular multiplicative inverse
        self.mu = self.mod_inverse(self.lambda_n, self.n)
    
    def generate_large_prime(self, bits):
        """
        Generate a large prime number
        
        Args:
            bits (int): Number of bits for the prime
        
        Returns:
            int: A large prime number
        """
        while True:
            # Generate a random odd number
            candidate = random.getrandbits(bits) | (1 << (bits - 1)) | 1
            
            # Check primality using Miller-Rabin test
            if self.is_prime(candidate):
                return candidate
    
    def is_prime(self, n, k=5):
        """
        Miller-Rabin primality test
        
        Args:
            n (int): Number to test for primality
            k (int): Number of iterations
        
        Returns:
            bool: True if probably prime, False if composite
        """
        if n <= 1 or n == 4:
            return False
        if n <= 3:
            return True
        
        # Write n as 2^r * d + 1
        d = n - 1
        r = 0
        while d % 2 == 0:
            d //= 2
            r += 1
        
        # Witness loop
        for _ in range(k):
            a = random.randint(2, n - 2)
            x = pow(a, d, n)
            
            if x == 1 or x == n - 1:
                continue
            
            for _ in range(r - 1):
                x = pow(x, 2, n)
                if x == n - 1:
                    break
            else:
                return False
        return True
    
    def mod_inverse(self, a, m):
        """
        Compute modular multiplicative inverse
        
        Args:
            a (int): Number to find inverse for
            m (int): Modulus
        
        Returns:
            int: Modular multiplicative inverse
        """
        def extended_gcd(a, b):
            if a == 0:
                return b, 0, 1
            else:
                gcd, x, y = extended_gcd(b % a, a)
                return gcd, y - (b // a) * x, x
        
        gcd, x, _ = extended_gcd(a, m)
        if gcd != 1:
            raise Exception('Modular inverse does not exist')
        else:
            return x % m
    
    def encrypt(self, m):
        """
        Encrypt a message
        
        Args:
            m (int): Message to encrypt
        
        Returns:
            int: Encrypted message
        """
        # Choose random r coprime to n
        r = self.generate_coprime(self.n)
        
        # Encryption: c = g^m * r^n mod n^2
        c = (pow(self.g, m, self.n_square) * pow(r, self.n, self.n_square)) % self.n_square
        
        return c
    
    def decrypt(self, c):
        """
        Decrypt a ciphertext
        
        Args:
            c (int): Ciphertext to decrypt
        
        Returns:
            int: Decrypted message
        """
        # Compute c^lambda mod n^2
        x = pow(c, self.lambda_n, self.n_square)
        
        # L function: (x - 1) / n
        l_x = (x - 1) // self.n
        
        # Decrypt: m = L(c^lambda mod n^2) * mu mod n
        m = (l_x * self.mu) % self.n
        
        return m
    
    def generate_coprime(self, n):
        """
        Generate a number coprime to n
        
        Args:
            n (int): Modulus
        
        Returns:
            int: A number coprime to n
        """
        while True:
            r = random.randint(1, n - 1)
            if math.gcd(r, n) == 1:
                return r
    
    def add_encrypted_values(self, c1, c2):
        """
        Add two encrypted values homomorphically
        
        Args:
            c1 (int): First encrypted value
            c2 (int): Second encrypted value
        
        Returns:
            int: Encrypted sum of the values
        """
        return (c1 * c2) % self.n_square

# Example usage
def main():
    # Create Paillier cryptosystem instance
    paillier = PaillierCrypto()
    
    # Example values to encrypt
    value1 = 10
    value2 = 20
    
    # Encrypt values
    encrypted_value1 = paillier.encrypt(value1)
    encrypted_value2 = paillier.encrypt(value2)
    
    # Homomorphic addition of encrypted values
    encrypted_sum = paillier.add_encrypted_values(encrypted_value1, encrypted_value2)
    
    
    # Decrypt the sum
    decrypted_sum = paillier.decrypt(encrypted_sum)
    


if __name__ == "__main__":
    main()
    