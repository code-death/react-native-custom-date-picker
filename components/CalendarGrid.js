import {View, Text, TouchableOpacity} from "react-native";
import {responsiveFontSize} from "react-native-responsive-dimensions";
import dayjs from "dayjs";
import {useState} from "react";
import _ from 'lodash'

const CalendarGrid = ({data = [], columnNum=6, onPress, customStyles={}, getTextColor, getTextBackgroundColor, setCurrentDate, currentDate, selectedDate, primaryColor, secondaryColor, minDate, maxDate}) => {
    const [pressColor, setPressColor] = useState(null)
    const [pressDate, setPressDate] = useState(null)

    const singleWidth = columnNum && (100/columnNum - 0.9).toString() + '%'
    const paddingVertical = columnNum && (100/columnNum*0.22 - 0.7).toString() + '%'

    let dateStyles = {}

    const handleSelectionOfDate = (item) => {
        if(item.type === 'month') {
            onPress(item.month)
            return
        }

        if(item.type === 'year') {
            onPress(item.text)
            return
        }

        let selectedDate = dayjs()
        let monthYearString = currentDate.format('YYYY/MM')
        switch(item.type) {
            case 'prevMonth':
                setCurrentDate(currentDate.subtract(1, 'month'))
                break
            case 'currentMonth':
                break
            case 'nextMonth':
                setCurrentDate(currentDate.add(1, 'month'))
                break
        }

        switch(item.type) {
            case 'prevMonth':
                monthYearString = currentDate.subtract(1, 'month').format('YYYY/MM')
                selectedDate = dayjs(monthYearString + '/' + item.text)
                break
            case 'currentMonth':
                selectedDate = dayjs(monthYearString + '/' + item.text)
                break
            case 'nextMonth':
                monthYearString = currentDate.add(1, 'month').format('YYYY/MM')
                selectedDate = dayjs(monthYearString + '/' + item.text)
                break
        }
        onPress(selectedDate)
    }

    // const handleDateSelectionColor = (item) => {
    //     setSelected(false);
    // }

    return (
        <View style={[{...customStyles} ,{flexDirection: customStyles?.flexDirection || 'row', flexWrap: 'wrap', borderColor: 'white', borderWidth: 1, gap: 3}]}>
            {
                data?.map((item, index) => {
                    switch(item.type) {
                        case 'day':
                            dateStyles.color = primaryColor ? primaryColor : 'black';
                            dateStyles.backgroundColor = 'white'
                            break
                        case 'prevMonth':
                            dateStyles.color = 'gray';
                            dateStyles.fontWeight= '200';
                            break
                        case 'currentMonth':
                            dateStyles.color = getTextColor(item.text);
                            dateStyles.backgroundColor = getTextBackgroundColor(item.text);
                            dateStyles.fontWeight= '400';
                            break
                        case 'nextMonth':
                            dateStyles.color = 'gray';
                            dateStyles.backgroundColor = 'white';
                            dateStyles.fontWeight= '200';
                            break
                    }

                    return <View key={index} style={{width: singleWidth, paddingVertical: paddingVertical, backgroundColor: pressColor && (_.isEqual(pressDate, item)) ? pressColor : dateStyles.backgroundColor ? dateStyles.backgroundColor : 'white', marginTop: 5}}>
                        <TouchableOpacity
                            disabled={item.type === 'day' || ((minDate && (dayjs(currentDate.format('YYYY/MM')  + '/' + item.text.toString()).isBefore(dayjs(minDate).subtract(1, "day"))) || (maxDate && dayjs(currentDate.format('YYYY/MM') + '/' + item.text.toString()).isAfter(maxDate))))}
                            onPressIn={() => {
                            setPressColor(secondaryColor + '45')
                            setPressDate(item)
                        }} onPressOut={() => setPressColor(null)} onPress={() => handleSelectionOfDate(item)}><Text style={{ textAlign: 'center', flexWrap: 'wrap', fontSize: responsiveFontSize(2.2), color: dateStyles.color, fontWeight: dateStyles.fontWeight}}>{item?.text}</Text></TouchableOpacity>
                    </View>
                })
            }
        </View>
    )
}

export default CalendarGrid
