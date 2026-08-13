import React, {use} from "react";
import {Link} from "@heroui/react";
import {TrafiServiceListGroupedFiltered} from "@/app/outgoing/traefik/components/TrafiServiceListGroupedFiltered";
import {RouteAggregator} from "@/app/outgoing/RouteAggregator";


export default function Home() {
    const servicesPresentable = RouteAggregator.fetchPresentableTrafiServicesType();

    return (
        <main
            className="container min-h-screen m-auto flex-col items-center justify-between pt-10 sm:p-24 px-5 lg:px-20 sm:px-10"
        >
            <Link
                className="text-3xl inline-block rounded-full bg-gray-500/30 py-2 px-6 mb-5 text-white/90 backdrop-blur-sm border-1 border-white/10"
                href="#"
            >
                {process.env.TB_PAGE_TITLE}
            </Link>
            <TrafiServiceListGroupedFiltered trafiServicesMap={servicesPresentable}></TrafiServiceListGroupedFiltered>
            <footer>
                <Link
                    className="float-right text-sm inline-block rounded-full bg-gray-500/10 py-2 px-6 mb-5 text-white/40 backdrop-blur-sm border-1 border-white/10"
                    href="https://github.com/BartoszKaszewczuk/trafiboard"
                >
                Developed by Bartosz Kaszewczuk on GitHub
                </Link>
            </footer>
        </main>
    )
}
