// app/activities/[id]/page.tsx
import { getActivityById } from "@/utils/actions";
import { notFound } from "next/navigation";
import { FaRegCalendarAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

// Cette fonction sera utilisée pour récupérer les données côté serveur avant de rendre la page
export async function getServerSideProps({ params }: { params: { id: string } }) {
    // Récupérer l'activité par ID
    const activity = await getActivityById(params.id);

    // Si l'activité n'est pas trouvée, retourner une page 404
    if (!activity) {
        return {
            notFound: true,
        };
    }

    // Retourner les données de l'activité dans les props
    return {
        props: {
            activity,
        },
    };
}

const ActivityDetailPage = ({ activity }: { activity: any }) => {
    // Formater la date de l'activité
    const formattedDate = new Date(activity.date).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <section className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-500 text-white px-6 py-12" dir="ltr">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden text-gray-900">
                {/* Afficher l'image si elle est présente */}
                {activity.imageUrl && (
                    <Image
                        src={activity.imageUrl}
                        alt={activity.title}
                        width={1200}
                        height={500}
                        className="w-full h-64 object-cover"
                    />
                )}
                <div className="p-6 space-y-4">
                    <h1 className="text-3xl font-bold text-green-700">{activity.title}</h1>
                    <div className="flex items-center text-gray-500 space-x-2 rtl:space-x-reverse">
                        <FaRegCalendarAlt />
                        <span>{formattedDate}</span>
                    </div>
                    <p className="text-lg">{activity.description}</p>
                    <div className="pt-4">
                        <Link href="/activites">
                            <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                                ← Retour aux activités
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ActivityDetailPage;
