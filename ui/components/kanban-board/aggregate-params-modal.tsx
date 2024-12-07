"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Merge, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import CopyAddress from "../ui/copy-address";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";

interface Contributor {
  address: string;
  blobID: string;
}

const AggregateParamsModalWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const sampleContributors: Contributor[] = [
    {
      address: "0x1234567890abcdef",
      blobID: "0x1234567890abcdef",
    },
    {
      address: "0x1234567890abcdef",
      blobID: "0x1234567890abcdef",
    },
    {
      address: "0x1234567890abcdef",
      blobID: "0x1234567890abcdef",
    },
  ];

  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setContributors(sampleContributors);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle className="font-display font-normal text-2xl">
            Aggregate Params
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Aggregate parameters for the selected models{" "}
          </DialogDescription>
        </DialogHeader>

        <Table>
          <TableCaption>Contributors on your model.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>BlobID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributors.map((contributor, index) => (
              <TableRow key={index}>
                <TableCell><CopyAddress className="text-sm" address={contributor.address} /></TableCell>
                <TableCell><CopyAddress className="text-sm font-mono" address={contributor.blobID} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button className="mt-4">Aggregate <Merge className="w-4 ml-1" /></Button>
      </DialogContent>
    </Dialog>
  );
};

export default AggregateParamsModalWrapper;
