import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Sample books data
    const books = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        cover_image:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
        description:
          "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
        genres: ["Classic", "Fiction", "Literary Fiction"],
        page_count: 218,
        published_date: "April 10, 1925",
        publisher: "Charles Scribner's Sons",
        rating: 4.5,
        status: "Available",
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        cover_image:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
        description:
          "To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature. The plot and characters are loosely based on Lee's observations of her family, her neighbors and an event that occurred near her hometown of Monroeville, Alabama, in 1936, when she was ten.",
        genres: ["Classic", "Historical Fiction", "Coming-of-age"],
        page_count: 281,
        published_date: "July 11, 1960",
        publisher: "J. B. Lippincott & Co.",
        rating: 4.8,
        status: "Available",
      },
      {
        title: "1984",
        author: "George Orwell",
        cover_image:
          "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&q=80",
        description:
          "1984 is a dystopian novel by English novelist George Orwell. It was published on 8 June 1949 by Secker & Warburg as Orwell's ninth and final book completed in his lifetime. Thematically, 1984 centres on the consequences of totalitarianism, mass surveillance, and repressive regimentation of persons and behaviours within society.",
        genres: ["Dystopian", "Science Fiction", "Political Fiction"],
        page_count: 328,
        published_date: "June 8, 1949",
        publisher: "Secker & Warburg",
        rating: 4.6,
        status: "Available",
      },
      {
        title: "The Invisible Life of Addie LaRue",
        author: "V.E. Schwab",
        cover_image:
          "https://images.unsplash.com/photo-1603162617003-eecf7f236bd3?w=400&q=80",
        description:
          "A Life No One Will Remember. A Story You Will Never Forget. France, 1714: in a moment of desperation, a young woman makes a Faustian bargain to live forever—and is cursed to be forgotten by everyone she meets.",
        genres: ["Fantasy", "Historical Fiction", "Romance"],
        page_count: 448,
        published_date: "October 6, 2020",
        publisher: "Tor Books",
        rating: 4.3,
        status: "Available",
      },
      {
        title: "Klara and the Sun",
        author: "Kazuo Ishiguro",
        cover_image:
          "https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?w=400&q=80",
        description:
          "From the bestselling and Booker Prize-winning author of Never Let Me Go and The Remains of the Day, a stunning new novel that asks, what does it mean to love?",
        genres: ["Science Fiction", "Literary Fiction"],
        page_count: 320,
        published_date: "March 2, 2021",
        publisher: "Knopf",
        rating: 4.1,
        status: "Available",
      },
      {
        title: "The Four Winds",
        author: "Kristin Hannah",
        cover_image:
          "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80",
        description:
          "From the number-one bestselling author of The Nightingale and The Great Alone comes a powerful American epic about love and heroism and hope, set during the Great Depression, a time when the country was in crisis and at war with itself, when millions were out of work and even the land seemed to have turned against them.",
        genres: ["Historical Fiction", "Fiction"],
        page_count: 464,
        published_date: "February 2, 2021",
        publisher: "St. Martin's Press",
        rating: 4.5,
        status: "Available",
      },
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        cover_image:
          "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80",
        description:
          "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?",
        genres: ["Fiction", "Fantasy", "Science Fiction"],
        page_count: 304,
        published_date: "September 29, 2020",
        publisher: "Viking",
        rating: 4.2,
        status: "Available",
      },
      {
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        cover_image:
          "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=400&q=80",
        description:
          "Harry Potter has no idea how famous he is. That's because he's being raised by his miserable aunt and uncle who are terrified Harry will learn that he's really a wizard, just as his parents were.",
        genres: ["Fantasy", "Young Adult", "Fiction"],
        page_count: 320,
        published_date: "June 26, 1997",
        publisher: "Scholastic",
        rating: 4.7,
        status: "Available",
      },
      {
        title: "Percy Jackson & The Lightning Thief",
        author: "Rick Riordan",
        cover_image:
          "https://images.unsplash.com/photo-1518744386442-2d48ac47a7eb?w=400&q=80",
        description:
          "Percy Jackson is a good kid, but he can't seem to focus on his schoolwork or control his temper. And lately, being away at boarding school is only getting worse - Percy could have sworn his pre-algebra teacher turned into a monster and tried to kill him.",
        genres: ["Fantasy", "Young Adult", "Mythology"],
        page_count: 377,
        published_date: "July 1, 2005",
        publisher: "Disney Hyperion",
        rating: 4.5,
        status: "Available",
      },
      {
        title: "The Hunger Games",
        author: "Suzanne Collins",
        cover_image:
          "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=400&q=80",
        description:
          "In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts. The Capitol is harsh and cruel and keeps the districts in line by forcing them all to send one boy and one girl between the ages of twelve and eighteen to participate in the annual Hunger Games, a fight to the death on live TV.",
        genres: ["Dystopian", "Young Adult", "Science Fiction"],
        page_count: 374,
        published_date: "September 14, 2008",
        publisher: "Scholastic Press",
        rating: 4.3,
        status: "Available",
      },
    ];

    // Insert books into the database
    const { data: booksData, error: booksError } = await supabase
      .from("books")
      .upsert(books, { onConflict: "title" })
      .select();

    if (booksError) {
      console.error("Error inserting books:", booksError);
      return new Response(JSON.stringify({ error: booksError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Create a sample user if it doesn't exist
    const { data: userData, error: userError } =
      await supabase.auth.admin.createUser({
        email: "demo@example.com",
        password: "password123",
        email_confirm: true,
        user_metadata: {
          name: "Demo User",
        },
      });

    if (userError && userError.message !== "User already registered") {
      console.error("Error creating user:", userError);
      return new Response(JSON.stringify({ error: userError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const userId =
      userData?.user?.id ||
      (await supabase.auth.admin.listUsers()).data.users.find(
        (u) => u.email === "demo@example.com",
      )?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "Failed to get user ID" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Create a sample project for the user
    const project = {
      user_id: userId,
      title: "The Hidden World",
      cover_image:
        "https://images.unsplash.com/photo-1518744386442-2d48ac47a7eb?w=400&q=80",
      description: "A fantasy novel about a hidden world beneath our own.",
      genres: ["Fantasy", "Adventure", "Young Adult"],
      status: "In Progress",
      views: 245,
      likes: 32,
      comments: 8,
      is_public: true,
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
    };

    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .upsert(project)
      .select();

    if (projectError) {
      console.error("Error creating project:", projectError);
      return new Response(JSON.stringify({ error: projectError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const projectId = projectData?.[0]?.id;

    // Create sample chapters for the project
    const chapters = [
      {
        project_id: projectId,
        title: "The Discovery",
        status: "Published",
        last_edited: new Date().toISOString(),
        word_count: 2450,
        views: 120,
        likes: 18,
        comments: 5,
      },
      {
        project_id: projectId,
        title: "The Entrance",
        status: "Published",
        last_edited: new Date().toISOString(),
        word_count: 1890,
        views: 95,
        likes: 12,
        comments: 3,
      },
    ];

    const { data: chaptersData, error: chaptersError } = await supabase
      .from("chapters")
      .upsert(chapters)
      .select();

    if (chaptersError) {
      console.error("Error creating chapters:", chaptersError);
      return new Response(JSON.stringify({ error: chaptersError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Create sample blocks for the first chapter
    if (chaptersData && chaptersData.length > 0) {
      const blocks = [
        {
          chapter_id: chaptersData[0].id,
          type: "paragraph",
          content:
            "It all began on a rainy Tuesday afternoon. The kind of rain that doesn't pour but persists, a constant drizzle that soaks through everything eventually. I was in the basement of my grandmother's old house, sorting through decades of accumulated memories after her passing.",
          position: 0,
        },
        {
          chapter_id: chaptersData[0].id,
          type: "paragraph",
          content:
            "The house itself was a relic, built in the early 1900s with all the character and quirks you'd expect. Creaking floorboards that announced your presence no matter how carefully you stepped. Doors that would swing open or closed seemingly of their own accord. Windows that whistled when the wind blew from the east.",
          position: 1,
        },
        {
          chapter_id: chaptersData[0].id,
          type: "heading-2",
          content: "The Basement",
          position: 2,
        },
        {
          chapter_id: chaptersData[0].id,
          type: "paragraph",
          content:
            "But it was the basement that always fascinated me as a child. Forbidden territory, of course, which only added to its mystique. Now, as an adult tasked with clearing out the house before it was sold, I finally had free reign to explore its secrets.",
          position: 3,
        },
      ];

      const { error: blocksError } = await supabase
        .from("blocks")
        .upsert(blocks);

      if (blocksError) {
        console.error("Error creating blocks:", blocksError);
        return new Response(JSON.stringify({ error: blocksError.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
    }

    // Create sample blocks for the second chapter
    if (chaptersData && chaptersData.length > 1) {
      const blocks = [
        {
          chapter_id: chaptersData[1].id,
          type: "paragraph",
          content:
            "The flashlight beam cut through the darkness, revealing stone steps descending steeply into the earth. They were worn in the middle, suggesting countless feet had traversed them over the years.",
          position: 0,
        },
        {
          chapter_id: chaptersData[1].id,
          type: "heading-2",
          content: "The Descent",
          position: 1,
        },
        {
          chapter_id: chaptersData[1].id,
          type: "paragraph",
          content:
            "As I descended, the temperature dropped noticeably. By the time I reached the bottom – some thirty steps down – I could see my breath forming small clouds in the beam of light.",
          position: 2,
        },
      ];

      const { error: blocksError } = await supabase
        .from("blocks")
        .upsert(blocks);

      if (blocksError) {
        console.error("Error creating blocks:", blocksError);
        return new Response(JSON.stringify({ error: blocksError.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
    }

    // Create sample borrowed books for the user
    if (booksData && booksData.length >= 2) {
      const borrowedBooks = [
        {
          user_id: userId,
          book_id: booksData[0].id,
          borrow_date: new Date().toISOString(),
          due_date: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 14 days from now
        },
        {
          user_id: userId,
          book_id: booksData[1].id,
          borrow_date: new Date().toISOString(),
          due_date: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 14 days from now
        },
      ];

      const { error: borrowedBooksError } = await supabase
        .from("borrowed_books")
        .upsert(borrowedBooks);

      if (borrowedBooksError) {
        console.error("Error creating borrowed books:", borrowedBooksError);
        return new Response(
          JSON.stringify({ error: borrowedBooksError.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }
    }

    // Create sample reading history for the user
    if (booksData && booksData.length >= 5) {
      const readingHistory = [
        {
          user_id: userId,
          book_id: booksData[2].id,
          last_read_date: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 30 days ago
          progress: 100,
        },
        {
          user_id: userId,
          book_id: booksData[3].id,
          last_read_date: new Date(
            Date.now() - 45 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 45 days ago
          progress: 100,
        },
        {
          user_id: userId,
          book_id: booksData[4].id,
          last_read_date: new Date(
            Date.now() - 60 * 24 * 60 * 60 * 1000,
          ).toISOString(), // 60 days ago
          progress: 100,
        },
      ];

      const { error: readingHistoryError } = await supabase
        .from("reading_history")
        .upsert(readingHistory);

      if (readingHistoryError) {
        console.error("Error creating reading history:", readingHistoryError);
        return new Response(
          JSON.stringify({ error: readingHistoryError.message }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }
    }

    // Create sample achievements for the user
    const achievements = [
      {
        user_id: userId,
        title: "Bookworm",
        description: "Read 5 books",
        icon: "📚",
        date_earned: new Date(
          Date.now() - 15 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 15 days ago
        progress: 100,
        is_completed: true,
      },
      {
        user_id: userId,
        title: "Speed Reader",
        description: "Finish a book in less than 3 days",
        icon: "⚡",
        date_earned: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 30 days ago
        progress: 100,
        is_completed: true,
      },
      {
        user_id: userId,
        title: "Genre Explorer",
        description: "Read books from 5 different genres",
        icon: "🧭",
        progress: 60,
        is_completed: false,
      },
    ];

    const { error: achievementsError } = await supabase
      .from("achievements")
      .upsert(achievements);

    if (achievementsError) {
      console.error("Error creating achievements:", achievementsError);
      return new Response(
        JSON.stringify({ error: achievementsError.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Update reading stats for the user
    const { error: readingStatsError } = await supabase
      .from("reading_stats")
      .upsert({
        user_id: userId,
        books_read: 8,
        pages_read: 2156,
        hours_read: 72,
      });

    if (readingStatsError) {
      console.error("Error updating reading stats:", readingStatsError);
      return new Response(
        JSON.stringify({ error: readingStatsError.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    return new Response(
      JSON.stringify({
        message: "Sample data created successfully",
        books: booksData?.length || 0,
        user: userData?.user?.email || "demo@example.com",
        project: projectData?.[0]?.title || "The Hidden World",
        chapters: chaptersData?.length || 0,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
