-- CreateTable
CREATE TABLE "Node" (
    "rootAddress" TEXT NOT NULL,
    "nodeAddress" TEXT NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("rootAddress","nodeAddress")
);
