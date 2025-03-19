'use client'

import {Card, CardBody, Tab, Tabs} from "@heroui/react";
import React from "react";

function getTabTitle(maybeTitle: string): string {
    if (maybeTitle.includes("//")) {
        return maybeTitle.split("//")[1]
    } else {
        return maybeTitle
    }
}

export function TrafiTabs(props: any) {
    const childTabs = props.children.map((child: any) => {
            const titleWithoutProtocol = getTabTitle(child._owner.props.title)
            return (<Tab key={child._owner.props.title} title={titleWithoutProtocol}>
                <Card className={"bg-transparent"}>
                {/*<Card className={"px-0 backdrop-blur-sm"}>*/}
                    <CardBody className={"px-0"}>
                        {child}
                    </CardBody>
                </Card>
            </Tab>)
        }
    )

    return (
        <Tabs aria-label="Hosts"
              size={"md"}
              variant={"bordered"}
              color={"primary"}
              classNames={{
                  // tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                  // cursor: "w-full bg-[#22d3ee]",
                  // tab: "max-w-fit px-3 h-12",
                  tab: "max-w-fit px-3 bg-slate-200 bg-gray-500/30",
                  // tabContent: "group-data-[selected=true]:text-[#06b6d4] bg-transparent",
                  // tabContent: "backdrop-blur-sm bg-slate-200",
                  tabContent: "text-white/80",
                  tabList: "backdrop-blur-sm bg-gray-500/30 border-1 border-gray-400",
                  panel: "bg-transparent px-0",
                  // base: "bg-transparent",
                  // tabWrapper: "bg-transparent",
              }}
        >
            {childTabs}
            {/*<Tab key={props.id} title={props.title}>*/}
            {/*    /!*<Card>*!/*/}
            {/*    /!*    <CardBody>*!/*/}
            {/*    /!*        {childrenTabs}*!/*/}
            {/*    {typeof props.children}*/}
            {/*    /!*{childrenTabs.length}*!/*/}
            {/*    /!*{props.children}*!/*/}
            {/*    "Inside TrafiTabs"*/}
            {/*    /!*</CardBody>*!/*/}
            {/*    /!*</Card>*!/*/}
            {/*</Tab>*/}
        </Tabs>
    )
}