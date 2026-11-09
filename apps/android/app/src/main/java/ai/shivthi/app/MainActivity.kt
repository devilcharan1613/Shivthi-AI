package ai.shivthi.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { ShivthiApp() }
    }
}

@Composable
private fun ShivthiApp() {
    val background = Color(0xFF080B10)
    MaterialTheme(colorScheme = darkColorScheme(
        background = background,
        surface = Color(0xFF101923),
        primary = Color(0xFF62D9CE)
    )) {
        Surface(modifier = Modifier.fillMaxSize(), color = background) {
            Column(
                modifier = Modifier.padding(22.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("SHIVTHI.AI", color = Color(0xFF62D9CE), fontSize = 13.sp)
                Spacer(Modifier.height(14.dp))
                Text("See the signal.", color = Color.White, fontSize = 32.sp)
                Text("Understand the world.", color = Color(0xFF62D9CE), fontSize = 27.sp)
                Text(
                    "Your intelligence workspace for technology, research, industries, and global markets.",
                    color = Color(0xFF9AA7B6), fontSize = 14.sp
                )
                Spacer(Modifier.height(12.dp))
                listOf(
                    "Command Center" to "Your global intelligence overview",
                    "Open Source" to "Repositories and developer ecosystem",
                    "AI Core" to "Models, datasets, and research",
                    "Domains" to "Companies and industry signals",
                    "Markets" to "Global market intelligence"
                ).forEach { (title, subtitle) ->
                    Surface(
                        color = Color(0xFF101923),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(Modifier.padding(16.dp)) {
                            Text(title, color = Color.White, fontSize = 16.sp)
                            Spacer(Modifier.height(4.dp))
                            Text(subtitle, color = Color(0xFF8996A5), fontSize = 12.sp)
                        }
                    }
                }
                Spacer(Modifier.weight(1f))
                Text(
                    "PREVIEW 0.1 • DATA CONNECTORS IN DEVELOPMENT",
                    color = Color(0xFF687789), fontSize = 9.sp
                )
            }
        }
    }
}
