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
    interface TrafiServiceListGroupedProps {
        trafiServices: TrafiServicePresentableType[]
        deduplicate: boolean
    }
}

module.exports = {
    TrafiServicePresentableType,
    TrafiServicePresentableList,

    TrafiServiceListProps,
    TrafiServiceListGroupedProps
};