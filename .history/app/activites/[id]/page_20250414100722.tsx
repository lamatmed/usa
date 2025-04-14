import { getActivityById } from "@/utils/actions";
import { notFound } from "next/navigation";
import { FaRegCalendarAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default async function ActivityDetailPage({ params }: { params: { id: string } }) {
    const activity = await getActivityById(params.id);

    if (!activity) return notFound();

    const formattedDate = new Date(activity.date).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <section className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-500 text-white px-6 py-12" dir="ltr">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden text-gray-900">
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
                        <Link href="/activities">
                            <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                                ← Retour aux activités
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
