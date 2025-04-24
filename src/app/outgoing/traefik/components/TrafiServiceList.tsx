import {TrafiServicePresentable} from "@/app/outgoing/traefik/models";
import {TrafiServiceCard} from "@/app/outgoing/traefik/components/TrafiServiceCard";

function isNullOrUndefined(obj: any) {
    return obj === undefined || obj === null;
}

export function TrafiServiceList({trafiServices}: { trafiServices: TrafiServicePresentable[] }) {
    const trafiServicesFiltered = trafiServices
        .filter(x => !isNullOrUndefined(x.name))
        .filter(x => !isNullOrUndefined(x.rule))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((service, index) => {
                return (<TrafiServiceCard {...service}
                    key={service.name+index}
                    serviceName={service.getCleanName()}
                    serviceRoute={service.getRoutes()[0]}
                    thumbnailUrl={service.thumbnailUrl}>
                </TrafiServiceCard>)
            }
        )

    const wrapped = (
        <div className="grid grid-flow-row-dense lg:grid-cols-4 gap-8 md:grid-cols-2 content-start">
            {trafiServicesFiltered}
        </div>
    )
    return wrapped;
}