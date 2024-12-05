import EditDeckComponent from "@/app/components/my-decks/edit-deck"

export default async function EditDeck({
    params,
}: Readonly<{
    params: Promise<{ id: string }>;
}>) {

    const { id } = await params;

    return (
        <EditDeckComponent id={id} />
    )
}
