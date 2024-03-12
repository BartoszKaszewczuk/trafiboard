// 'use client';
import React from "react";
import { use } from "react";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/table";
import {Button} from "@nextui-org/button";
import {TraefikRoutes} from "@/app/outgoing/traefik/components/TraefikRoutes";
import {getRulesFromRouters} from "@/app/outgoing/traefik/client";

export default function Home() {
    const items = use(getRulesFromRouters());
    // const items = TraefikRoutes;
    const dupa = <ol>
        <li>dupa</li>
    </ol>

    return (<main className="flex min-h-screen flex-col items-center justify-between p-24">
        <TraefikRoutes traefikRoutes={items}></TraefikRoutes>
                    {/*{items}*/}
                    {/*<TraefikRoutes></TraefikRoutes>*/}
                    {/*<Table>*/}
                        {/*<TableHeader>*/}
                        {/*    <TableColumn key="name">Name</TableColumn>*/}
                        {/*    /!*<TableColumn key="route">Route</TableColumn>*!/*/}
                        {/*</TableHeader>*/}
                        {/*<TableBody>*/}
                        {/*    <TableRow key="name2">*/}
                        {/*        <TableCell>name</TableCell>*/}
                        {/*        /!*<TableCell>rule</TableCell>*!/*/}
                        {/*    </TableRow>*/}
                        {/*</TableBody>*/}
                        {/*<TableBody emptyContent={"No rows to display."}>{[]}</TableBody>*/}

                    {/*</Table>*/}
                    <Button>Click Me</Button>
    </main>)
}
