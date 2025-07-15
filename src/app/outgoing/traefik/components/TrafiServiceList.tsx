'use client'
import {TrafiServiceCard} from "@/app/outgoing/traefik/components/TrafiServiceCard";
import {FC} from "react";
import {TrafiServiceListProps} from 'TrafiTypes'
import {isNullOrUndefined} from "@/app/utils";
import {DEMO_MODE, DEMO_MODE_EXCLUDE_SERVICES} from "@/app/outgoing/traefik/config";

export const TrafiServiceList: FC<TrafiServiceListProps> = ({trafiServices}: TrafiServiceListProps) => {
    const trafiServicesFiltered = trafiServices
        .filter(svc => !isNullOrUndefined(svc.name))
        .filter(svc => !isNullOrUndefined(svc.rule))
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(svc => {
            if (DEMO_MODE) {
                return !DEMO_MODE_EXCLUDE_SERVICES.some(demo => svc.name.includes(demo))
            }
            return true
        })
        .map((service, index) => {
                return (<TrafiServiceCard {...service}
                                          key={service.name + index}
                                          trafiService={service}
                >
                </TrafiServiceCard>)
            }
        )

    const wrapped = (
        <div className="grid grid-flow-row-dense content-start place-items-center lg:grid-cols-4 gap-8 grid-cols-2">
            {trafiServicesFiltered}
        </div>
    )
    return wrapped;
}