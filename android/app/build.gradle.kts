plugins {
    id("com.android.application")
}

android {
    namespace = "org.qubators.qafsupport"
    compileSdk = 34

    defaultConfig {
        applicationId = "org.qubators.qafsupport"
        minSdk = 24
        targetSdk = 34
        versionCode = 2
        versionName = "1.0.1"
    }

    signingConfigs {
        create("release") {
            // CI provides these env vars; local builds fall back to android/qaf-release.keystore.
            val ksPath = System.getenv("KEYSTORE_PATH") ?: "qaf-release.keystore"
            storeFile = file(ksPath)
            storePassword = System.getenv("KEYSTORE_PASSWORD")
            keyAlias = System.getenv("KEY_ALIAS") ?: "qaf"
            keyPassword = System.getenv("KEY_PASSWORD")
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = false
            isShrinkResources = false
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation("androidx.browser:browser:1.8.0")
}
