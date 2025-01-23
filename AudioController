import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AudioController {

    @Autowired
    private SimpMessagingTemplate template;

    @PostMapping("/send-audio-link")
    public void sendAudioLink(@RequestBody AudioRequest request) {
        String audioUrl = request.getAudioUrl();
        System.out.println("Sending audio URL to clients: " + audioUrl);
        this.template.convertAndSend("/topic/audio-link", audioUrl);
    }

    static class AudioRequest {
        private String audioUrl;

        public String getAudioUrl() {
            return audioUrl;
        }

        public void setAudioUrl(String audioUrl) {
            this.audioUrl = audioUrl;
        }
    }
}
