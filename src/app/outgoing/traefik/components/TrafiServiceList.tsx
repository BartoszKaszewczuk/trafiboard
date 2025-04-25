'use client'
import {TrafiService} from "@/app/outgoing/traefik/models";
import {TrafiServiceCard} from "@/app/outgoing/traefik/components/TrafiServiceCard";
import {FC} from "react";
import {TrafiServiceListProps} from 'TrafiTypes'
import {isNullOrUndefined} from "@/app/utils";

export const TrafiServiceList: FC<TrafiServiceListProps> = ({trafiServices}: TrafiServiceListProps) => {
    const trafiServicesFiltered = trafiServices
        .filter(x => !isNullOrUndefined(x.name))
        .filter(x => !isNullOrUndefined(x.rule))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((service, index) => {
                return (<TrafiServiceCard {...service}
                                          key={service.name + index}
                                          serviceName={TrafiService.cleanupTrafiServiceName(service.name)}
                                          serviceRoute={TrafiService.getRoutesFromRule(service.rule, service.port)[0]}
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