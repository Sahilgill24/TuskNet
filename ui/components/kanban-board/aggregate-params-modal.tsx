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
import CopyAddress from "@/components/ui/copy-address";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

interface Contributor {
  address: string;
  blobID: string;
}

const AggregateParamsModalWrapper = ({
  children,
  id,
  title,
}: {
  children: React.ReactNode;
  id: string;
  title: string;
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
  const [aggregating, setIsAggregating] = useState(false);
  const [loss, setLoss] = useState(null);

  useEffect(() => {
    // TODO: Fetch contributors from the server
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
            Aggregate parameters for {title}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <Spinner className="w-8 h-8 mb-4 mx-auto" />
        ) : (
          <>
            <Table>
              <TableCaption>
                {contributors.length
                  ? "Contributors on your model."
                  : "No Contributors on your model, currently.."}
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>BlobID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributors.map((contributor, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <CopyAddress
                        className="text-sm"
                        address={contributor.address}
                      />
                    </TableCell>
                    <TableCell>
                      <CopyAddress
                        className="text-sm font-mono"
                        address={contributor.blobID}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              disabled={contributors.length == 0 || aggregating}
              onClick={() => setIsAggregating(true)}
              className="mt-4"
            >
              {aggregating ? (
                "Aggregating..."
              ) : (
                <>
                  {" "}
                  Aggregate <Merge className="w-4 ml-1" />
                </>
              )}
            </Button>
          </>
        )}
        {loss ? (
          <p className="w-full rounded-lg border border-primary/20 p-4 flex flex-row items-center gap-2 justify-center font-semibold bg-secondary">
            Loss <MoveRight className="w-4" /> {loss}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default AggregateParamsModalWrapper;
