'use client'

import {Card, CardBody, Tab, Tabs} from "@heroui/react";
import React from "react";
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

export function TrafiTabs(props: any) {
    const childTabs = props.children.map((child: any) => {
            const titleWithoutProtocol = getTabTitle(child._owner.props.title)
            return (<Tab key={child._owner.props.title} title={titleWithoutProtocol}>
                <Card className={"bg-transparent"}>
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
                  tab: "max-w-fit px-3 bg-slate-200 bg-gray-500/30",
                  tabContent: "text-white/80",
                  tabList: "backdrop-blur-sm bg-gray-500/30 border-1 border-white/30",
                  panel: "bg-transparent px-0",
              }}
        >
            {childTabs}
        </Tabs>
    )
}