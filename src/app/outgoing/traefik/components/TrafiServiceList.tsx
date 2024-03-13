import {TrafiService} from "@/app/outgoing/traefik/models";
import {Card, CardFooter, Image, Button} from "@nextui-org/react";
import {Grid, GridItem} from "@chakra-ui/layout";
import {Link} from "@nextui-org/link";


export function TrafiServiceList({trafiServices}: { trafiServices: TrafiService[] }) {
    const trafi = trafiServices.map(service => {
        return (
            <GridItem w='100%' key={service.name}>
                <Link
                    isExternal
                    href={service.getRoutes()[0]}
                    showAnchorIcon
                >{service.getRoutes()[0]}</Link>
                {/*<Card*/}
                {/*    isFooterBlurred*/}
                {/*    radius="lg"*/}
                {/*    className="border-none"*/}
                {/*    isPressable*/}
                {/*    onPress={() => console.log("item pressed")}*/}
                {/*>*/}
                {/*    <Image*/}
                {/*        alt="Woman listing to music"*/}
                {/*        className="object-cover"*/}
                {/*        height={200}*/}
                {/*        // src="https://picsum.photos/200"*/}
                {/*        src="/next.svg"*/}
                {/*        width={200}*/}
                {/*    />*/}
                {/*    /!*<CardFooter*!/*/}
                {/*    /!*    className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">*!/*/}
                {/*    /!*    /!*<p className="text-tiny text-white/80">Available soon.</p>*!/*!/*/}
                {/*    /!*    <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg"*!/*/}
                {/*    /!*            size="sm">*!/*/}
                {/*    /!*        {service.getCleanName()}*!/*/}
                {/*    /!*    </Button>*!/*/}
                {/*    /!*</CardFooter>*!/*/}
                {/*    <CardFooter className="text-small justify-between">*/}
                {/*        /!*<b>{service.getCleanName()}</b>*!/*/}
                {/*        <p className="text-default-500">{service.getCleanName()}</p>*/}
                {/*    </CardFooter>*/}
                {/*</Card>*/}
            </GridItem>
        )
    })
    const aa = (
        <Grid templateColumns='repeat(5, 1fr)' gap={6}>
            {trafi}
        </Grid>
    )
    return aa;
}