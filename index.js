import {useState} from "react";
import CaledarComponent from "./components/CalendarComponent";
import TimePicker from "./components/TimePicker";
import dayjs from "dayjs";
import {TouchableWithoutFeedback, TouchableOpacity, View, Text} from "react-native";

const CustomDateTimePicker = ({
                                  defaultDate,
                                  setDateTime,
                                  setShowDatePicker,
                                  mode,
                                  startDate,
                                  setStartDate,
                                  endDate,
                                  setEndDate,
                                  minDate,
                                  maxDate,
                                  hourStep,
                                  minStep,
                                  minHour,
                                  maxHour
                              }) => {
    const [date, setDate] = useState(defaultDate !== '' ? defaultDate : dayjs());
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(true);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

    const onDateConfirm = (date) => {
        setDate(date);
        setIsDatePickerVisible(false);
        if (mode === "datetime") {
            setIsTimePickerVisible(true);
        } else if (mode === "date") {
            setDateTime(date);
            setShowDatePicker(false);
        }
    };
    const onDateCancel = () => {
        setIsDatePickerVisible(false);
        setShowDatePicker(false);
    };
    const onTimeConfirm = (date) => {
        setDateTime(date);
        setIsTimePickerVisible(false);
        setShowDatePicker(false);
    };
    const onTimeCancel = () => {
        setIsTimePickerVisible(false);
        setIsDatePickerVisible(true);
    };

    const onRangeConfirm = (startDate, endDate) => {
        setStartDate(startDate);
        setEndDate(endDate);
        setShowDatePicker(false);
    };

    if (isDatePickerVisible && !isTimePickerVisible) {
        return (
            <View style={{flex: 1}}>
                <Text onPress={onDateCancel}
                      style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: '#00000045'}}>
                </Text>
                <CaledarComponent
                    // accentColor={'#c50808'}
                    // dateSelectColor={'#1b7900'}
                    onDateCancel={onDateCancel}
                    onDateConfirm={onDateConfirm}
                    onRangeConfirm={onRangeConfirm}
                    defaultDate={defaultDate !== '' ? defaultDate : dayjs()}
                    startDate={startDate !== '' ? startDate : dayjs()}
                    endDate={endDate}
                    mode={mode}
                    minDate={minDate}
                    maxDate={maxDate}
                />
            </View>

        );
    } else if (!isDatePickerVisible && isTimePickerVisible) {
        return (
            <View style={{flex: 1}}>
                <Text onPress={onDateCancel}
                      style={{position: 'absolute', width: '100%', height: '100%', backgroundColor: '#00000045'}}>
                </Text>
                <TimePicker
                    minHour={minHour ? minHour : 0}
                    maxHour={maxHour ? maxHour : 23}
                    onTimeCancel={onTimeCancel}
                    onTimeConfirm={onTimeConfirm}
                    defaultDate={date}
                    hourStep={hourStep > 0 ? hourStep : 1}
                    minStep={hourStep > 0 ? minStep : 5}
                />
            </View>
        );
    }
};

export default CustomDateTimePicker;
