'use client';
import React, {use} from "react";
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/table";
import {TraefikRouter} from "@/app/outgoing/traefik/models";
import {capitalize} from "@nextui-org/shared-utils";

export function TraefikRoutes({traefikRoutes}: { traefikRoutes: Array<TraefikRouter> }) {
    const rules = traefikRoutes;
    const rows = rules.map((route, index) => {
            return {
                key: index,
                obj: route,
            }
        }
    )
    const columns = Object.keys(rules[0]).map((route, index) => {
        return {
            key: index,
            obj: route,
        }
    });

    return (
        <Table aria-label="Example static collection table">
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{capitalize(column.obj)}</TableColumn>}
            </TableHeader>
            <TableBody items={rows}>
                {
                    (row) =>
                        <TableRow key={row.key}>
                            <TableCell>{row.obj.name}</TableCell>
                            <TableCell>{row.obj.rule}</TableCell>
                        </TableRow>

                }
            </TableBody>
        </Table>
    )
}
