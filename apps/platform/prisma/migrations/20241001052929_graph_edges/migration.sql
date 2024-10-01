-- CreateTable
CREATE TABLE "GraphEdge" (
    "srcAddress" TEXT NOT NULL,
    "desAddress" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "GraphEdge_pkey" PRIMARY KEY ("srcAddress","desAddress")
);
