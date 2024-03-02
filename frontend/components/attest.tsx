import * as React from 'react'
import { type BaseError, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { Address, erc20Abi as abi } from 'viem'
import PortalContract from '../../frontend/utils/PortalContract.json'
import { ethers } from 'ethers'

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
        const address = "0xc6d98f3c28e28c87f5dba70358ec34b5825810c8"
        const schemaId = "347D0856D7B7522726D8662FD72CAB5AF9CF9E8E37BC5C9E55455AD62749E406" // Assuming schemaId is a string that represents bytes32
        const expirationDate = Math.floor(Date.now() / 1000) + 2592000 // Assuming expirationDate is a number representing uint64
        const subject = "change in identity" // Encoding string to bytes

        // Retrieve oldAddress (connected to the application) and newAddress from form data
        const oldAddress = formData.get('oldAddress') as Address // Assuming this is provided or obtained elsewhere in your application
        const newAddress = formData.get('newAddress') as Address

        // Assuming the contract expects attestationData as a bytes array containing the two addresses
        // Note: This step might need adjustment based on how your contract handles bytes input
        const attestationData = [oldAddress, newAddress]

        const validationPayloads = [""] // Populate this array based on your application's logic

        const attestationPayload = [schemaId, expirationDate, subject, attestationData]

        writeContract({
            address,
            abi: PortalContract,
            functionName: 'attest',
            args: [attestationPayload, validationPayloads],
            value: BigInt(0)
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash })

    return (
        <form onSubmit={submit}>
            <label>Send Attestation</label>
            <input name="contractAddress" placeholder="Contract Address" required />
            <input name="schemaId" placeholder="Schema ID" required />
            <input name="expirationDate" placeholder="Expiration Date" required />
            <input name="subject" placeholder="Subject" required />
            <input name="oldAddress" placeholder="Old Address" required />
            <input name="newAddress" placeholder="New Address" required />
            {/* Add inputs or logic for validationPayloads as necessary */}
            <button disabled={isPending} type="submit">
                {isPending ? 'Confirming...' : 'Send Attestation'}
            </button>
            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}
            {error && (
                <div>Error: {(error as BaseError).shortMessage || error.message}</div>
            )}
        </form>
    )
}
