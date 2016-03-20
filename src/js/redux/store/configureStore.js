import { createStore } from 'redux'
import rootReducer from '../reducers'

export default function configureStore() {
  const store = createStore(
    rootReducer
  )

  return store
}


let storeStructure  = {
	onlyChina: true,
	selectedEvents: 'football',
	onlyFinal: true,
	selectedDate: '2016-08-08',
	schedules: [
		{
			'0801': {
				events: [
					{
						name: '男子足球决赛',
						event: 'football',
						time: '22:00:00',
						isFinal: true,
						chinaCompeteIn: true,
						detail: {}
					}
				]
			}
		}
	]

};

