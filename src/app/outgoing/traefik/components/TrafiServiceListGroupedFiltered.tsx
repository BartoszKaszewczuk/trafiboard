'use client'
import _ from 'lodash'
import React, {FC, useState} from "react";
import {TrafiServicePresentableMap, TrafiServicePresentableType, TrafiHostServiceMap} from "TrafiTypes";
import {Input} from "@heroui/input";
import {Switch} from "@heroui/switch";
import {TrafiServiceListGrouped} from "@/app/outgoing/traefik/components/TrafiServiceListGrouped";
import {Tab, Tabs} from "@heroui/react";
import {FaMagnifyingGlass} from "react-icons/fa6";
import {isNullOrUndefined} from "@/app/utils";

function getTabTitle(maybeTitle: string): string {
    if (isNullOrUndefined(maybeTitle)) {
        return maybeTitle
    }

    if (maybeTitle.includes("://")) {
        return maybeTitle.split("://")[1]
    } else {
        return maybeTitle
    }
}

export const TrafiServiceListGroupedFiltered: FC<TrafiHostServiceMap> = ({trafiServicesMap}) => {
    const [query, setQuery] = useState('')
    const [dedup, setDedup] = useState(true)

    const hostServiceMap = new Map<string, TrafiServicePresentableType[]>
    for (const [key, value] of trafiServicesMap) {
        hostServiceMap.set(key.hostname, value)
    }

    const servicesFlat = Array.from(trafiServicesMap.values()).flat()
    let chain = _.chain(servicesFlat)
    // Apply deduplication
    if (dedup) {
        chain = chain.uniqBy("rule")
    }

    // Apply search term to filter services
    const allFiltered = chain
        .filter(x => x.rule.includes(query) || x.name.includes(query))
        .value()


    // const mergedServices = new Map([["All", allFiltered], ...hostServiceMap])

    const TAB_NAME_ALL = "All"
    const TAB_ALL = (
        <Tab key={TAB_NAME_ALL} title={TAB_NAME_ALL}>
            <div
                className="flex flex-row p-1 mb-5 rounded-lg backdrop-blur-sm bg-gray-500/30 border-1 border-white/30">
                <div className="flex-auto w-80">
                    <Input
                        type="text"
                        placeholder="Filter services..."
                        variant={"faded"}
                        radius={"sm"}
                        classNames={{
                            input: "bg-red-700",
                            innerWrapper: "bg-transparent",
                        }}
                        startContent={
                            <FaMagnifyingGlass/>
                        }
                        autoFocus
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                </div>
                <div className="flex-auto w-80 pl-6 align-middle">
                    <Switch isSelected={dedup}
                            className="text-white align-middle pt-1.5"
                            onValueChange={setDedup}>
                        <p className="text-white/80">Deduplicate</p>
                    </Switch>
                </div>
            </div>
            <TrafiServiceListGrouped key={TAB_NAME_ALL} trafiServices={allFiltered}></TrafiServiceListGrouped>
        </Tab>
    )

    return (
        // <div className="flex w-full flex-col">
            <Tabs
                  key={"dupa"}
                  aria-label="Hosts"
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
                {TAB_ALL}
                <Tab key={"paka"} title={"kakaHost"}></Tab>

                {Array.from(hostServiceMap.entries()).map(([hostUrl, services], index) => {
                    const host = getTabTitle(hostUrl)
                    return (
                        <Tab key={host} title={host}>
                            <TrafiServiceListGrouped key={host} trafiServices={services}></TrafiServiceListGrouped>
                        </Tab>
                    )
                })
                }
            </Tabs>
        // </div>
    )
}