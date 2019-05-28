import modelEnhance from '@/utils/modelEnhance';

export default modelEnhance({
    namespace: 'table',
    state: {
        courseInfo: [],
        courseTimeInfo: [],
        perCourseId: '',
        dataList: {
            list: []
        }
    },
});