-- CreateTable
CREATE TABLE "PlatformContractAddress" (
    "graphContractAddress" TEXT NOT NULL,
    "verifierRegistryAddress" TEXT NOT NULL,
    "issuerRegistryAddress" TEXT NOT NULL,
    "lVerifierAddress" TEXT NOT NULL,

    CONSTRAINT "PlatformContractAddress_pkey" PRIMARY KEY ("graphContractAddress","verifierRegistryAddress","issuerRegistryAddress","lVerifierAddress")
);
