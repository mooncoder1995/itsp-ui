import modelEnhance from '@/utils/modelEnhance';

export default modelEnhance({
  namespace: 'lessons',
  state: {
    courseItem: '',
    courseName: '',
    courseNames: [],
    lessonInfo: []
  },

  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        courseItem: payload.item
      };
    }
  }
});