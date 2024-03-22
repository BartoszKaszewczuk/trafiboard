'use client';
import {Card, CardFooter, Image, CardBody} from "@nextui-org/react";


export function TrafiServiceCard({serviceName, serviceRoute}) {
    return (
        <div key={serviceName} className="text-wrap">
            <Card
                isFooterBlurred
                isPressable
                onPress={(e) => window.open(serviceRoute)}
                radius="lg"
                className="border-none object-cover"
                fullWidth={true}
            >
                <CardBody className="overflow-visible p-0">
                    <Image
                        height="100%"
                        width="100%"
                        src="https://picsum.photos/350/150"
                        // src={serviceRoute + '/favicon.ico'}
                    ></Image>
                </CardBody>
                <CardFooter
                    className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10"
                >
                    {/*<Link*/}
                    {/*    className="text-white inline-block"*/}
                    {/*    href={serviceRoute}*/}
                    {/*>{serviceName}</Link>*/}
                    <p className="inline-block text-white/80">{serviceName}</p>
                </CardFooter>
            </Card>
        </div>
    )
}