'use client';
import React, {use} from "react";
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/table";
import {TraefikRouter, TrafiService} from "@/app/outgoing/traefik/models";
import {capitalize} from "@nextui-org/shared-utils";
import {Link} from "@nextui-org/link";
// import _ from "lodash";

export function TraefikRoutes({trafiServices}: { trafiServices: TrafiService[] }) {
    const services = trafiServices;
    // const servicesGroupedByProvider = _.groupBy(services, 'provider')
    const rows = services.map((route, index) => {
            return {
                key: index,
                obj: route,
            }
        }
    )
    const columns = Object.keys(services[0]).map((route, index) => {
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
                {(row) =>
                    <TableRow key={row.key}>
                        {Object.keys(row.obj).map((fieldName, index) => <TableCell key={index}>{row.obj[fieldName]}</TableCell>)}
                    </TableRow>
                }
            </TableBody>
        </Table>
    )
}
