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

const fileMetaDefault: GradioFileMeta = {
    _type: "gradio.FileData"
}

export const ChaoWeiData: GradioFileDataItem = {
    path: "/tmp/gradio/d8b9096d3067233ef2db6531f3291e9afef6c0a72053a73c26ed79ea60814521/許朝偉.wav",
    url: "http://163.13.201.159:7854/gradio_api/file=/tmp/gradio/d8b9096d3067233ef2db6531f3291e9afef6c0a72053a73c26ed79ea60814521/許朝偉.wav",
    orig_name: "wei.WAV_0000425600_0000715520.wav",
    size: 289964,
    mime_type: "audio/wav",
    meta: fileMetaDefault
}

export const PeiyuData: GradioFileDataItem = {
    path: "/tmp/gradio/fb5a8cd350c5e5a68ebd0f72fa7269966eb139380a0ab19831d3f4baf3018732/peiyu.WAV_0000425600_0000715520.wav",
    url: "http://163.13.201.159:7854/gradio_api/file=/tmp/gradio/fb5a8cd350c5e5a68ebd0f72fa7269966eb139380a0ab19831d3f4baf3018732/peiyu.WAV_0000425600_0000715520.wav",
    orig_name: "peiyu.WAV_0000425600_0000715520.wav",
    size: 289964,
    mime_type: "audio/wav",
    meta: fileMetaDefault
}