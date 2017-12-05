
export interface Group {
    description?: string;
    display_name?: string;
    id: string;
    image_display_url?: string;
    name?: string;
    title?: string;
}

export interface Keywords {
    fi: string[];
}

export interface NotesTranslated {
    en: string;
    fi: string;
    sv: string;
    [key:string]: string;
}

export interface Organization {
    approval_status: string;
    created: Date;
    description: string;
    id: string;
    image_url: string;
    is_organization: boolean;
    name: string;
    revision_id: string;
    state: string;
    title: string;
    type: string;
}

export interface DescriptionTranslated {
    en: string;
    fi: string;
    sv: string;
    [key:string]: string;
}

export interface NameTranslated {
    en?: string;
    fi?: string;
    sv?: string;
    [key:string]: string;
}

export interface TimeSeriesPrecision {
    fi: string[];
}

export interface NewResource {
    cache_last_updated?: any;
    cache_url?: any;
    created: Date;
    datastore_active: boolean;
    description: string;
    description_translated: DescriptionTranslated;
    file_size: string;
    format: string;
    hash: string;
    last_modified?: any;
    mimetype?: any;
    mimetype_inner?: any;
    name: string;
    name_translated: NameTranslated;
    position: number;
    position_info: string;
    resource_group_id: string;
    resource_type?: string;
    size?: any;
    state: string;
    time_series_end: string;
    time_series_precision: TimeSeriesPrecision;
    time_series_precision_en: string;
    time_series_precision_sv: string;
    time_series_start: string;
    url: string;
    url_type?: any;
}

export interface TitleTranslated {
    en: string;
    fi: string;
    sv: string;
    [key:string]: string;
}

export interface UpdateFrequency {
    fi: string[];
}

export interface NewDataset {
    author?: any;
    author_email?: any;
    creator_user_id: string;
    date_released: string;
    date_updated: string;
    external_urls: string[];
    geographical_coverage: string[];
    global_id: string;
    groups: any;
    isopen: boolean;
    keywords: Keywords;
    license_id: string;
    license_title: string;
    license_url: string;
    maintainer: string;
    maintainer_email: string;
    maintainer_website: string;
    metadata_created: Date;
    metadata_modified: Date;
    name: string;
    name_translated: NameTranslated;
    notes: string;
    notes_translated: NotesTranslated;
    num_resources: number;
    num_tags: number;
    organization: Organization;
    owner_org: string;
    private: boolean;
    relationships_as_object: any[];
    relationships_as_subject: any[];
    resources: NewResource[];
    state: string;
    tags: any[];
    title: string;
    title_translated: TitleTranslated;
    type: string;
    update_frequency: UpdateFrequency;
    url: string;
    version?: any;
}
