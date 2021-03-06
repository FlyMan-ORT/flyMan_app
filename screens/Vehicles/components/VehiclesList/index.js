import React, { useState, useEffect } from "react";
import { Box, FlatList } from "native-base";
import { Dimensions, RefreshControl, Alert } from "react-native";
import { fetchReservations } from "../../../../api/reservations";
import Loader from '../../../../components/Loader';
import ReservationItem from "../ReservationItem";
import { useIsFocused } from "@react-navigation/native";
import { EmptyList } from "../EmptyList";

const VehiclesList = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const window = Dimensions.get("screen").width;

  useEffect(() => {
    fetchingReservations();
  }, [isFocused])

  const fetchingReservations = async () => {
    setLoading(true);
    try {
      let response = await fetchReservations();
      setReservations(response);
    } catch (error) {
      openAlert(error.message);
    } finally { setLoading(false) }
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <Box>
      <FlatList
        width={window}
        data={reservations}
        renderItem={
          ({ item }) => <ReservationItem
            item={item}
            navigateToDetails={navigation}
          />
        }
        keyExtractor={item => item._id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchingReservations}
          />
        }
        ListEmptyComponent={EmptyList}
      />
    </Box>
  )
};

const openAlert = (error) => {
  Alert.alert('Error', error, [{ text: 'OK', style: 'cancel' }]);
}

export default VehiclesList;