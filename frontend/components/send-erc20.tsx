import * as React from 'react'
import {
    type BaseError,
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi'
import { Address, erc20Abi as abi } from 'viem'

export function SendERC20() {
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const address = formData.get('tokenAddress') as Address
        const value = BigInt(formData.get('value') as string)
        const destination = formData.get('destination') as Address
        writeContract({
            address,
            abi,
            functionName: 'transfer',
            args: [destination, value],
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    return (
        <form onSubmit={submit}>
            <label>Send ERC20 </label>
            <input name="tokenAddress" placeholder="token address" required />
            <input name="value" placeholder="amount" required />
            <input name="destination" placeholder='destination' required />
            <button
                disabled={isPending}
                type="submit"
            >
                {isPending ? 'Confirming...' : 'Send ERC20'}
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