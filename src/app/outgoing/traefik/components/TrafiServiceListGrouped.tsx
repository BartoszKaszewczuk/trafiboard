'use client'
import {TrafiServiceList} from "@/app/outgoing/traefik/components/TrafiServiceList";
import _ from 'lodash'
import React, {FC, useState} from "react";
import {TrafiServiceListGroupedProps } from "TrafiTypes";

export const TrafiServiceListGrouped: FC<TrafiServiceListGroupedProps> = ({trafiServices}) => {
    const discardTypes = ['traefik'];

    const trafiTypes = _.chain(trafiServices)
        /**
         * @see TrafiServicePresentable.entryPointType
         */
        .groupBy("entryPointType")
        .pickBy((v, k) => discardTypes.some((discard) => !discard.includes(k.toLowerCase())))
        .map((value, entryPointName) => {
            return (
                <div key={entryPointName} className="pb-50 block mb-10 mt-5">
                    <h3 className="mb-5 text-xl inline-block rounded-full bg-gray-500/30 py-2 px-6 text-white/90 backdrop-blur-sm border-white/10 border-1">
                        {entryPointName}
                    </h3>
                    <TrafiServiceList trafiServices={value}></TrafiServiceList>
                </div>
            )
        })
        .value()

    const grouped = (
        <div>
            <div className="lg:grid-cols-4 gap-8 md:grid-cols-2 content-start">
                {trafiTypes}
            </div>
        </div>
    )
    return grouped;
}