import {TrafiService} from "@/app/outgoing/traefik/models";
import {Link} from "@nextui-org/link";


export function TrafiServiceList({trafiServices}: { trafiServices: TrafiService[] }) {
    const trafi = trafiServices
        .filter(service => service.provider != "internal")
        .map(service => {
        return (
            <div key={service.name} className="grid grid-cols-4 gap-4 text-wrap">
                <Link
                    href={service.getRoutes()[0]}
                    showAnchorIcon
                >{service.getRoutes()[0]}</Link>
            </div>
        )
    })

    const wrapped = (
        <div className="grid grid-cols-4 gap-4">
            {trafi}
        </div>
    )
    return wrapped;
}