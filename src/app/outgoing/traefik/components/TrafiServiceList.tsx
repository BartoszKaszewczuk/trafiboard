import {TrafiService} from "@/app/outgoing/traefik/models";
import {TrafiServiceCard} from "@/app/outgoing/traefik/components/TrafiServiceCard";


export function TrafiServiceList({trafiServices}: { trafiServices: TrafiService[] }) {
    const trafiServicesFiltered = trafiServices
        .filter(service => service.provider != "internal")
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((service) => <TrafiServiceCard key={service.name} serviceName={service.getCleanName()} serviceRoute={service.getRoutes()[0]}></TrafiServiceCard> )

    const wrapped = (
        <div className="grid grid-flow-row-dense lg:grid-cols-4 gap-8 md:grid-cols-2 content-start">
            {trafiServicesFiltered}
        </div>
    )
    return wrapped;
}