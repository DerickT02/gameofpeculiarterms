"use client"

export default function Page({ params }: { params: { gameID: string } }) {

    return (
        <div>
            <h1>Game ID: {params.gameID}</h1>
        </div>
    )
}