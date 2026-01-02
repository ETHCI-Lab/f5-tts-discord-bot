/**
 * body type of f5 tts joinQueue api
 */

export type GradioFileDataItem = {
    path: string;
    url: string;
    orig_name: string;
    size: number;
    mime_type: string;
    meta: GradioFileMeta;
}

export type GradioFileMeta = {
    _type: "gradio.FileData";
}


export interface F5TtsBody {
    data: Array<GradioFileDataItem | string | boolean | number>;
    event_data: null;
    fn_index: number;
    trigger_id: number;
    session_hash: string;
}

export const fileMetaDefault: GradioFileMeta = {
    _type: "gradio.FileData"
}



