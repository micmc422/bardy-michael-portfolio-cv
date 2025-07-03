export default async function EstimationTypePage({params}:{params: Promise<{slug:string}>}) {
    const {slug } = await params;

    return <>{slug}</>
}