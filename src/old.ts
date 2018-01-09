
export interface Tag {
    name: string;
    display_name?: string​;
​​​​​    id?: string;
​​​​​    revision_timestamp?: string;
​​​​​    state?: string;
​​​​​    vocabulary_id?: string;
}

export interface Extras {
    agency: string;
    categories: string;
    date_released: string;
    date_updated: string;
    external_reference: string;
    external_reference_en: string;
    external_reference_se: string;
    geographic_coverage: string;
    geographic_granularity: string;
    notes_en: string;
    notes_se: string;
    source: string;
    taxonomy_url: string;
    temporal_coverage_from: string;
    temporal_coverage_to: string;
    temporal_granularity: string;
    title_en: string;
    title_se: string;
    update_frequency: string;
}

export interface TrackingSummary {
    recent: number;
    total: number;
}

export interface Resource {
    cache_last_updated?: any;
    cache_url?: any;
    created: Date;
    description: string;
    format: string;
    hash: string;
    id: string;
    last_modified?: any;
    mimetype?: any;
    mimetype_inner?: any;
    name: string;
    package_id: string;
    position: number;
    resource_group_id: string;
    resource_type: string;
    size?: any;
    tracking_summary: TrackingSummary;
    url: string;
    webstore_last_updated?: any;
    webstore_url?: any;
}

export interface ExtraField {
    __extras: {
        package_id: string;
        revision_id: string;
    },
    key: string;
    value: string;
}

export interface OriginalDataset {
    author: string;
    author_email: string;
    ckan_url: string;
    extras?: ExtraField[];
    groups: string[];
    id: string;
    isopen: boolean;
    license: string;
    license_id: string;
    maintainer?: any;
    maintainer_email?: any;
    metadata_created: Date;
    metadata_modified: Date;
    name: string;
    notes: string;
    notes_rendered: string;
    owner_org: string;
    private: boolean;
    ratings_average?: any;
    ratings_count: number;
    relationships: any[];
    resources: Resource[];
    revision_id: string;
    state: string;
    tags: Tag[];
    title: string;
    tracking_summary: TrackingSummary;
    type: string;
    url: string;
    version?: any;
}
