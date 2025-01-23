import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    @Autowired
    private SimpMessagingTemplate template;

    @MessageMapping("/send-audio-link")
    public void sendAudioLink(String audioUrl) {
        System.out.println("Received audio URL: " + audioUrl);
        this.template.convertAndSend("/topic/audio-link", audioUrl);
    }
}
