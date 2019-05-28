import modelEnhance from '@/utils/modelEnhance';

export default modelEnhance({
    namespace: 'edit',

    state: {
        courseInfo: [],
        courseTimeInfo: [],
        allCourseInfo: {
            list: []
        },
    }
});