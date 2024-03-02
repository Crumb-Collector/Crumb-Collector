import * as React from 'react'
import { type BaseError, useWriteContract } from 'wagmi'
import { Address, } from 'viem'
import { VeraxSdk } from "@verax-attestation-registry/verax-sdk";

const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);

export function SendAttestation() {
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        // Retrieve oldAddress (connected to the application) and newAddress from form data
        const oldAddress = formData.get('oldAddress') as Address // Assuming this is provided or obtained elsewhere in your application
        const newAddress = formData.get('newAddress') as Address
        const portalAddress = "0xc6d98f3c28e28c87f5dba70358ec34b5825810c8";
        const schemaId = "0x347D0856D7B7522726D8662FD72CAB5AF9CF9E8E37BC5C9E55455AD62749E406".toLowerCase();
        const attestationPayload = {
            schemaId,
            expirationDate: 18446744073709551616, // 2 ^ 53 max value
            subject: "0x6368616e676520696e206964656e74697479",
            attestationData: [{ oldAddress }, { newAddress }],
        };
        const schem = await veraxSdk.schema.getSchema(schemaId)
        const port = await veraxSdk.portal.getPortalByAddress(portalAddress)
        veraxSdk.schema.typeName
        console.log(schem);
        console.log(port);
        const validationPayloads: string[] = [];
        const newAttestation = await veraxSdk.portal.attest(portalAddress, attestationPayload, validationPayloads);
        console.log(newAttestation);
    }


    return (
        <form onSubmit={submit}>
            <label>Attest that you've changed wallets! </label>
            {/* <input name="contractAddress" placeholder="Contract Address" required /> */}
            {/* <input name="schemaId" placeholder="Schema ID" required /> */}
            {/* <input name="expirationDate" placeholder="Expiration Date" required /> */}
            {/* <input name="subject" placeholder="Subject" required /> */}
            <input name="oldAddress" placeholder="Old Address" required />
            <input name="newAddress" placeholder="New Address" required />
            {/* Add inputs or logic for validationPayloads as necessary */}
            <button disabled={isPending} type="submit">
                {isPending ? 'Confirming...' : 'Send Attestation'}
            </button>
            {hash && <div>Transaction Hash: {hash}</div>}
            {error && (
                <div>Error: {(error as BaseError).shortMessage || error.message}</div>
            )}
        </form>
    )
}
