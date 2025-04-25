declare module 'TrafiTypes' {
    type TrafiServicePresentableType = {
        port: string,
        provider: string,
        name: string,
        rule: string,
        entryPointType: string,
        thumbnailUrl: string | null,
    }

    interface TrafiServiceListProps {
        trafiServices: TrafiServicePresentableType[]
    }
    interface TrafiServicePresentableList {
        trafiServices: TrafiServicePresentableType[]
    }
    interface TrafiServicePresentableMap {
        trafiServicesMap: Map<string, TrafiServicePresentableType[]>
    }
    interface TrafiServiceListGroupedProps {
        trafiServices: TrafiServicePresentableType[]
    }
}

module.exports = {
    TrafiServicePresentableType,
    TrafiServicePresentableList,
    TrafiServicePresentableMap,

    TrafiServiceListProps,
    TrafiServiceListGroupedProps
};