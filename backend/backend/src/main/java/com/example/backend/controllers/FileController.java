package com.example.backend.controllers;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@RestController
@RequestMapping("/file")
@CrossOrigin(origins = "http://localhost:4200")
public class FileController {

    // define a alocation
    public static final String DIRECTORY = System.getProperty("user.home") + "/Downloads/uploads/";

    // define a method to upload files
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFiles(@RequestParam("files") List<MultipartFile> files) throws IOException {
        StringBuilder result = new StringBuilder();

        for (MultipartFile file : files) {
            String filename = StringUtils.cleanPath(file.getOriginalFilename());
            Path fileStorage = Paths.get(DIRECTORY + "1/", filename).toAbsolutePath().normalize();
            // Ensure the directory exists
            Files.createDirectories(fileStorage.getParent());
            // Save the file
            Files.copy(file.getInputStream(), fileStorage, StandardCopyOption.REPLACE_EXISTING);
            result.append("File stored successfully: ").append(filename).append("\n");
        }
        // After looping through all files and attempting to save them, return the
        // overall results
        return ResponseEntity.ok(result.toString());
    }

    // define a method to download files
    @GetMapping("/download/{foldername}")
    public ResponseEntity<Resource> downloadFolder(@PathVariable("foldername") String foldername) throws IOException {
        Path folderPath = Paths.get(DIRECTORY, foldername).toAbsolutePath().normalize();

        if (!Files.exists(folderPath) || !Files.isDirectory(folderPath)) {
            return ResponseEntity.notFound().build();
        }

        // Temporary file to hold the ZIP.
        Path zipPath = Files.createTempFile(foldername, ".zip");
        try (ZipOutputStream zos = new ZipOutputStream(Files.newOutputStream(zipPath))) {
            // Walk the directory and add files to the zip.
            Files.walk(folderPath).filter(path -> !Files.isDirectory(path)).forEach(path -> {
                ZipEntry zipEntry = new ZipEntry(folderPath.relativize(path).toString());
                try {
                    zos.putNextEntry(zipEntry);
                    Files.copy(path, zos);
                    zos.closeEntry();
                } catch (IOException e) {
                    System.err.println("Error while adding file to ZIP: " + path);
                }
            });
        }

        // Cleanup: zipPath.toFile().deleteOnExit(); // Optional: delete the zip file
        // when the JVM exits.

        Resource resource = new UrlResource(zipPath.toUri());
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + foldername + ".zip\"");

        return ResponseEntity.ok()
                .headers(httpHeaders)
                .contentType(MediaType.parseMediaType("application/zip"))
                .body(resource);
    }

}
