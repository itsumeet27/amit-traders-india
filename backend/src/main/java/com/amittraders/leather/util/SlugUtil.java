package com.amittraders.leather.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public final class SlugUtil {

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s_]+");
    private static final Pattern MULTI_DASH = Pattern.compile("-{2,}");

    private SlugUtil() {
    }

    public static String toSlug(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }
        String normalized = Normalizer.normalize(input.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        String slug = WHITESPACE.matcher(normalized.toLowerCase(Locale.ENGLISH)).replaceAll("-");
        slug = NON_LATIN.matcher(slug).replaceAll("");
        slug = MULTI_DASH.matcher(slug).replaceAll("-");
        return slug.replaceAll("^-|-$", "");
    }
}
