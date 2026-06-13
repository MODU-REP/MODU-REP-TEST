import os

TARGET_FILE = r"c:\Users\ASDS\Desktop\REPTIME\modurep\src\app\community\page.tsx"

with open(TARGET_FILE, "r", encoding="utf-8") as f:
    content = f.read()

# Normalize CRLF to LF
normalized_content = content.replace("\r\n", "\n")

start_marker = "            {/* Post Listings (DCInside Table Style) */}"
if start_marker not in normalized_content:
    # Try alternate description
    start_marker = "            {/* Post Listings (Optimized Responsive Layout) */}"

end_marker = "            {/* Board Controls */}"

if start_marker in normalized_content and end_marker in normalized_content:
    start_idx = normalized_content.index(start_marker)
    end_idx = normalized_content.index(end_marker)
    
    REPLACEMENT_TEXT = """            {/* Post Listings (Optimized Responsive Layout) */}
            <div className="glass rounded-2xl overflow-hidden border border-white/[0.05] bg-[#111111]/30 shadow-xl">
              {/* Mobile View: Vertical list cards to prevent table sizing and clipping bugs */}
              <div className="block sm:hidden divide-y divide-white/[0.04] text-xs font-bold">
                {paginatedPosts.map((post) => (
                  <div key={post.id} className="p-4 hover:bg-white/[0.02] transition-colors group">
                    <div className="flex items-center gap-1.5 min-w-0 w-full mb-1.5">
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border border-white/[0.03] shrink-0 ${categoryColors[post.category] || "bg-zinc-800 text-zinc-300"}`}>
                        {post.category}
                      </span>
                      {post.hot && <Flame size={12} className="text-orange-400 shrink-0" />}
                      <Link 
                        href={`/community/${post.id}`} 
                        className="text-zinc-200 hover:text-gold font-bold transition-colors truncate min-w-0 flex-1 text-xs"
                      >
                        {post.title}
                      </Link>
                      {post.comments > 0 && (
                        <span className="text-[10px] text-red-400 font-black shrink-0">
                          [{post.comments}]
                        </span>
                      )}
                      {post.hasImage && (
                        <ImageIcon size={12} className="text-zinc-500 shrink-0 ml-1" />
                      )}
                    </div>
                    {/* Mobile Info row */}
                    <div className="flex items-center flex-wrap gap-2 text-[9px] text-zinc-500 font-bold">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>{post.time}</span>
                      <span>•</span>
                      <span>조회 {post.views}</span>
                      <span>•</span>
                      <span className="text-gold">추천 {post.likes}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Full size table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-black text-zinc-400 uppercase tracking-wider">
                      <th className="py-3 px-4 text-center w-16">번호</th>
                      <th className="py-3 px-4">제목</th>
                      <th className="py-3 px-4 text-center w-24">글쓴이</th>
                      <th className="py-3 px-4 text-center w-20">작성일</th>
                      <th className="py-3 px-4 text-center w-16">조회</th>
                      <th className="py-3 px-4 text-center w-16">추천</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-xs font-bold">
                    <AnimatePresence mode="popLayout">
                      {paginatedPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                          {/* 번호 */}
                          <td className="py-3 px-4 text-center text-zinc-500">
                            {post.id}
                          </td>
                          {/* 제목 */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border border-white/[0.03] ${categoryColors[post.category] || "bg-zinc-800 text-zinc-300"}`}>
                                {post.category}
                              </span>
                              {post.hot && <Flame size={12} className="text-orange-400 shrink-0" />}
                              <Link 
                                href={`/community/${post.id}`} 
                                className="text-zinc-200 hover:text-gold font-bold transition-colors truncate max-w-[420px]"
                              >
                                {post.title}
                              </Link>
                              {post.comments > 0 && (
                                <span className="text-[10px] text-red-400 font-black shrink-0">
                                  [{post.comments}]
                                </span>
                              )}
                              {post.hasImage && (
                                <ImageIcon size={12} className="text-zinc-500 shrink-0 ml-1" />
                              )}
                            </div>
                          </td>
                          {/* 글쓴이 */}
                          <td className="py-3 px-4 text-center text-zinc-400 font-medium truncate max-w-[100px]">
                            {post.author}
                          </td>
                          {/* 작성일 */}
                          <td className="py-3 px-4 text-center text-zinc-500 font-medium">
                            {post.time}
                          </td>
                          {/* 조회수 */}
                          <td className="py-3 px-4 text-center text-zinc-500 font-medium">
                            {post.views}
                          </td>
                          {/* 추천수 */}
                          <td className="py-3 px-4 text-center text-gold font-black">
                            {post.likes}
                          </td>
                        </tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-20 text-zinc-600 font-bold text-xs">
                  등록된 게시글이 없습니다.
                </div>
              )}
            </div>
\n"""
    
    new_content = normalized_content[:start_idx] + REPLACEMENT_TEXT + normalized_content[end_idx:]
    with open(TARGET_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Success: Index-based replacement complete!")
else:
    print("Error: Markers not found!")
