'use client'
import _ from 'lodash'
import React, {FC, ReactElement, useState} from "react";
import {Input, Switch} from "@heroui/react";
import Image from 'next/image';
import {TrafiServicePresentableMap, TrafiServicePresentableType, TrafiHostServiceMap} from "TrafiTypes";
import {TrafiServiceListGrouped} from "@/app/outgoing/traefik/components/TrafiServiceListGrouped";
import {Tab, Tabs} from "@heroui/react";
import {FaMagnifyingGlass} from "react-icons/fa6";
import {applyDemoDomainOverride, isNullOrUndefined} from "@/app/utils";
import iconNginx from './icon-nginx.svg';
import iconTraefik from './icon-traefik.svg';
import {ServiceType} from "@/app/outgoing/traefik/models";
import {DEMO_MODE} from "@/app/outgoing/traefik/config";

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

function getImage(hostType: ServiceType): ReactElement | null {
    let icon
    switch (hostType) {
        case ServiceType.TRAEFIK:
            icon = iconTraefik
            break
        case ServiceType.NGINX:
            icon = iconNginx
            break
    }
    return null
    return <Image
        className={"inline-block fill-blue-500 relative"}
        width={20}
        src={icon} alt={`${hostType} icon`}/>
}

export const TrafiServiceListGroupedFiltered: FC<TrafiHostServiceMap> = ({trafiServicesMap}) => {
    const [query, setQuery] = useState('')
    const [dedup, setDedup] = useState(true)

    const servicesFlat = Array.from(trafiServicesMap.values()).flat()
    let chain = _.chain(servicesFlat)
    // Apply deduplication
    if (dedup) {
        chain = chain.uniqBy("rule")
    }

    // Apply search term to filter services
    const allFiltered = chain
        .filter(x => x.rule.includes(query.toLowerCase()) || x.name.includes(query.toLowerCase()))
        .value()

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
        <div className="flex w-full flex-col">
            <Tabs
                key={"hosts"}
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
                {Array.from(trafiServicesMap.entries()).map(([trafiHost, services], index) => {
                    let host: string
                    if (DEMO_MODE) {
                        host = getTabTitle(applyDemoDomainOverride(trafiHost.hostname))
                    } else {
                        host = getTabTitle(trafiHost.hostname)
                    }
                    return (
                        <Tab key={host} title={
                            <div className="flex items-center space-x-2 relative">
                                {getImage(trafiHost.hostType)}
                                <span>{host}</span>
                            </div>
                        }>
                            <TrafiServiceListGrouped key={host} trafiServices={services}></TrafiServiceListGrouped>
                        </Tab>
                    )
                })
                }
            </Tabs>
        </div>
    )
}