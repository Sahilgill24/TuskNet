import os
import sys
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa

def generate_large_prime(bit_length):
    return rsa.generate_private_key(public_exponent=65537, key_size=bit_length, backend=default_backend()).private_numbers().p

class PedersonCommitment:
    def __init__(self, security=1024):
        self.p = generate_large_prime(security)
        self.q = generate_large_prime(security * 2)
        self.g = int.from_bytes(os.urandom(32), 'big') % self.q
        self.s = int.from_bytes(os.urandom(32), 'big') % self.q
        self.h = pow(self.g, self.s, self.q)
    
    def commit(self, x):
        r = int.from_bytes(os.urandom(32), 'big') % self.q
        c = (pow(self.g, x, self.q) * pow(self.h, r, self.q)) % self.q
        return c, r
    
    def verify(self, c, x, r):
        return c == (pow(self.g, x, self.q) * pow(self.h, r, self.q)) % self.q
    
    def add_commitments(self, c1, c2):
        return (c1 * c2) % self.q
    
    def decrypt_commitment(self, c, r, x):
        """
        Decrypt a commitment by verifying the committed value.
        
        Args:
            c (int): The commitment value
            r (int): The random salt used in commitment
            x (int): The value to verify
        
        Returns:
            bool: True if the commitment is valid for the given value, False otherwise
        """
        # Verify that the commitment matches the claimed value
        verification = self.verify(c, x, r)
        
        if verification:
            return x
        else:
            raise ValueError("Commitment verification failed. The value might be incorrect.")

# Initialize the commitment scheme
commitment = PedersonCommitment()

def encrypt_cost(cost):
    # Assuming cost is an integer
    cost_int = int(cost)
    c, r = commitment.commit(cost_int)
    print(f"salt: {r}")
    print(f"Encrypted cost: {c}")
    sys.stdout.flush()
    return c, r

def decrypt_cost(encrypted_cost, salt):
    """
    Decrypt a cost by verifying its commitment.
    
    Args:
        encrypted_cost (int): The encrypted cost commitment
        salt (int): The random salt used in commitment
    
    Returns:
        int: The original cost if verification is successful
    """
    try:
        # We need to know the original value to decrypt/verify
        # In a real-world scenario, this would involve knowledge of the original value
        for possible_cost in range(1000):  # Example search range
            try:
                decrypted = commitment.decrypt_commitment(encrypted_cost, salt, possible_cost)
                print(f"Decrypted cost: {decrypted}")
                return decrypted
            except ValueError:
                continue
        
        print("Could not decrypt the cost")
        return None
    except Exception as e:
        print(f"Decryption error: {e}")
        return None

def aggregate_commitments(commitments):
    result = 1
    for c in commitments:
        result = commitment.add_commitments(result, c)
    return result

if __name__ == '__main__':
    ans = encrypt_cost(21)
    print(ans)
    decrypt_cost(ans[0], ans[1])
    decrypt_cost(34782924409446055591895580207589126342519290645218021187429675150264206621930057384671904422092630129825819057962966827636569626290413568452297605610627519396535333402020375670301058938200124297686964840034486199713353591403397746058594331574411921723449897885681429456601437470554650395946556124652371434309,64398634693160284864487220926801022894047318073207901901780512778131833500708)
