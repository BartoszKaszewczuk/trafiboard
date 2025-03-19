import {TrafiServicePresentable} from "@/app/outgoing/traefik/models";
import {TrafiServiceList} from "@/app/outgoing/traefik/components/TrafiServiceList";
import _ from 'lodash'

export function TrafiServiceListGrouped({title, trafiServices}: { title: string, trafiServices: TrafiServicePresentable[] }) {
    const discardTypes = ['traefik'];

    const trafiTypes = _.chain(trafiServices)
        /**
         * @see TrafiServicePresentable.entryPointType
         */
        .groupBy("entryPointType")
        .pickBy((v, k) => discardTypes.some((discard) => !discard.includes(k.toLowerCase())))
        .map((value, entryPointName) => {
            return (
                <div key={entryPointName} className="pb-50 block">
                    <h3 className="mt-16 mb-5 text-xl inline-block rounded-full bg-gray-500/30 py-2 px-6 text-white/90 backdrop-blur-sm">
                        {entryPointName}
                    </h3>
                    <TrafiServiceList trafiServices={value}></TrafiServiceList>
                </div>
            )
        })
        .value()

        const grouped = (
            <div className="lg:grid-cols-4 gap-8 md:grid-cols-2 content-start">
                {trafiTypes}
            </div>
        )
        return grouped;
}