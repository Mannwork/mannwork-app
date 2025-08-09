import { useState } from "react";

import {
    Dimensions,
    Image,
    Modal, // Para obtener el tamaño de la pantalla
    StatusBar,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import type { Message } from "@/common/types/message.type";

interface Props {
    message: Message;
}

const { width, height } = Dimensions.get("window"); // Obtener el ancho y alto de la pantalla

const MessageImage = ({ message }: Props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const handleImagePress = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedImage("");
    };

    return (
        <View>
            <TouchableWithoutFeedback
                onPress={() => handleImagePress(message.content)}
            >
                <View className="rounded-lg overflow-hidden">
                    <Image
                        source={{ uri: message.content }}
                        className="w-48 h-32" // Puedes ajustar el tamaño inicial
                        resizeMode="cover"
                    />
                </View>
            </TouchableWithoutFeedback>

            {/* Visor de imagen en pantalla completa (Modal) */}
            <Modal
                animationType="fade" // Puedes usar "slide" también
                transparent={true} // Para que el fondo sea transparente y se vea parte del chat
                visible={modalVisible}
                onRequestClose={handleCloseModal} // Para manejar el botón de retroceso en Android
            >
                <TouchableWithoutFeedback onPress={handleCloseModal}>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.9)", // Fondo semi-transparente oscuro
                            justifyContent: "center",
                            alignItems: "center",
                            paddingTop: StatusBar.currentHeight, // Ajuste para la barra de estado
                        }}
                    >
                        <Image
                            source={{ uri: selectedImage }}
                            style={{
                                width: width,
                                height: height,
                                resizeMode: "contain",
                            }} // La imagen ocupa la pantalla
                        />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default MessageImage;
