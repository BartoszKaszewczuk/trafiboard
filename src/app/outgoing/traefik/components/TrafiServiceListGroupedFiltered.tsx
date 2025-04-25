'use client'
import _ from 'lodash'
import React, {FC, useState} from "react";
import {TrafiServicePresentableMap, TrafiServicePresentableType} from "TrafiTypes";
import {Input} from "@heroui/input";
import {Switch} from "@heroui/switch";
import {TrafiServiceListGrouped} from "@/app/outgoing/traefik/components/TrafiServiceListGrouped";
import {Tab, Tabs} from "@heroui/react";

export const TrafiServiceListGroupedFiltered: FC<TrafiServicePresentableMap> = ({trafiServicesMap}) => {
    const [query, setQuery] = useState('')
    const [dedup, setDedup] = useState(true)

    const servicesFlat = Array.from(trafiServicesMap.values()).flat()

    let chain = _.chain(servicesFlat)
    if (dedup) {
        chain = chain.uniqBy("rule")
    }

    const filtered = chain
        .filter(x => x.rule.includes(query))
        .value()

    const mergedServices = new Map([["All", filtered], ...trafiServicesMap])

    return (
        <div>
            <div className={"flex-col grid grid-flow-row-dense lg:grid-cols-4 gap-8 md:grid-cols-2"}>
            {/*<div className="flex w-full flex-col">*/}
                <Input
                    type="text"
                    placeholder="Filter services..."
                    variant={"faded"}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <Switch isSelected={dedup} onValueChange={setDedup}>Deduplicate</Switch>
            </div>
            <div className="flex w-full flex-col">
                <Tabs aria-label="Hosts"
                      size={"md"}
                      variant={"bordered"}
                      color={"primary"}
                      classNames={{
                          tab: "max-w-fit px-3 bg-slate-200 bg-gray-500/30",
                          tabContent: "text-white/80",
                          tabList: "backdrop-blur-sm bg-gray-500/30 border-1 border-white/30",
                          panel: "bg-transparent px-0",
                      }}
                >
                    {Array.from(mergedServices.entries()).map(([host, services], index) =>
                        <Tab key={host} title={host}>
                            <TrafiServiceListGrouped key={host} trafiServices={services}></TrafiServiceListGrouped>
                        </Tab>
                    )}
                </Tabs>
            </div>
        </div>
    )
}